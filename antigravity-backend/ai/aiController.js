const supabase = require('../utils/supabaseClient');

/**
 * AI Match Talent Controller
 * Computes a compatibility score between a Casting Call and a Professional Profile
 * using an algorithmic representation (mocked deeply for this stage).
 */
exports.matchTalent = async (req, res) => {
    try {
        const { castingCallId, requiredSkills, location } = req.body;
        const brandId = req.user.id;

        if (!castingCallId) {
            return res.status(400).json({ success: false, message: 'Casting Call ID is required' });
        }

        // 1. Fetch all active professional profiles
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select('user_id, role, location, is_verified, daily_rate, availability_status');

        if (profileErr) throw profileErr;

        // 2. Intelligence Engine (Matching algorithm mock)
        const matchResults = profiles.map(profile => {
            let score = 50; // Base score

            // Location match (+20)
            if (profile.location && location && profile.location.toLowerCase().includes(location.toLowerCase())) {
                score += 20;
            }

            // Verification bonus (+15)
            if (profile.is_verified) {
                score += 15;
            }

            // Availability bonus (+15)
            if (profile.availability_status === 'AVAILABLE') {
                score += 15;
            }

            // Cap at 100
            score = Math.min(score, 100);

            // Add slight randomness to simulate deeper AI analysis
            score -= Math.floor(Math.random() * 5);

            return {
                talent_id: profile.user_id,
                brand_id: brandId,
                casting_id: castingCallId,
                compatibility_score: score,
                match_reasons: ['Location Match', 'Verified Professional']
            };
        });

        // Filter out low scores
        const topMatches = matchResults.filter(m => m.compatibility_score > 70)
            .sort((a, b) => b.compatibility_score - a.compatibility_score)
            .slice(0, 10);

        // 3. Upsert scores into `match_scores` table
        if (topMatches.length > 0) {
            const { error: upsertErr } = await supabase
                .from('match_scores')
                .upsert(topMatches, { onConflict: 'talent_id,casting_id' });

            if (upsertErr) {
                console.error('Match Score Upsert Error:', upsertErr);
                // Non-fatal, proceed to return results
            }
        }

        return res.json({
            success: true,
            matches: topMatches
        });

    } catch (error) {
        console.error('AI Matching Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to compute AI talent matches' });
    }
};
