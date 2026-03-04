const express = require('express');
const axios = require('axios');
const { supabase } = require('../supabase');
const router = express.Router();

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const SYNC_QUERY = `
  query matchedUser($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    recentAcSubmissionList(username: $username, limit: 20) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

router.post('/:username', async (req, res) => {
    const { username } = req.params;
    const { user_id } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'LeetCode username is required' });
    }

    if (!user_id) {
        // For local testing, we might bypass but in prod 'user_id' is necessary for upsert.
        return res.status(400).json({ error: 'Supabase user_id is required' });
    }

    try {
        // 1. Fetch data from LeetCode GraphQL
        const response = await axios.post(LEETCODE_GRAPHQL_URL, {
            query: SYNC_QUERY,
            variables: { username }
        });

        const data = response.data.data;

        // Check if the user exists on LeetCode
        if (!data.matchedUser) {
            return res.status(404).json({ error: 'LeetCode user not found' });
        }

        const { recentAcSubmissionList } = data;

        // 2. Format submissions for Supabase
        // LeetCode's recentAcSubmissionList does not natively include difficulty,
        // so we set it to 'Unknown' unless we do deep fetching.
        const formattedSubmissions = recentAcSubmissionList.map((sub) => ({
            user_id: user_id,
            problem_slug: sub.titleSlug,
            problem_title: sub.title,
            difficulty: 'Unknown', // LeetCode GraphQL 'recentAcSubmissionList' omitted this property in the spec
            solved_at: new Date(sub.timestamp * 1000).toISOString()
        }));

        // 3. Upsert to Supabase
        // Requires a unique constraint on (user_id, problem_slug) in Supabase.
        // If testing without a real project, this will fail. We'll send it back gently if it fails.
        if (formattedSubmissions.length > 0) {
            const { error: upsertError } = await supabase
                .from('submissions')
                .upsert(formattedSubmissions, { onConflict: 'user_id,problem_slug', ignoreDuplicates: true });

            if (upsertError) {
                console.error('Supabase Upsert Error:', upsertError);
                // Do not crash the server on missing table/keys, just let the user know.
                return res.status(500).json({
                    error: 'Failed to save submissions to database. Have you created the submissions table?',
                    details: upsertError.message
                });
            }
        }

        // 4. Update user's LeetCode username in the 'users' table
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ lc_username: username })
            .eq('id', user_id);

        if (userUpdateError) {
            console.error('Supabase User Update Error (Ignored):', userUpdateError);
        }

        res.status(200).json({
            message: 'Sync successful',
            syncedCount: formattedSubmissions.length,
            submissions: formattedSubmissions
        });

    } catch (error) {
        console.error('Error syncing with LeetCode API:', error);
        res.status(500).json({ error: 'Failed to connect to LeetCode API' });
    }
});

module.exports = router;
