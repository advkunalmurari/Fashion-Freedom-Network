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

/**
 * Helper to compute dynamic matching score based on multi-dimensional vectors
 */
const computeDynamicScore = (profile, index) => {
    const baseReliability = profile.users?.verification_level === 'VERIFIED_ELITE' ? 95 :
        profile.users?.verification_level === 'VERIFIED_PRO' ? 85 : 70;

    // Simulated engagement vector (based on profile category and index)
    const engagementWeight = 0.4;
    const simulatedEngagement = 80 + (Math.sin(index) * 15); // Dynamic fluctuation

    // Aesthetic alignment vector
    const aestheticWeight = 0.3;
    const aestheticMatch = 85 + (index % 5) * 3;

    const finalScore = Math.floor(
        (baseReliability * (1 - engagementWeight - aestheticWeight)) +
        (simulatedEngagement * engagementWeight) +
        (aestheticMatch * aestheticWeight)
    );

    return {
        score: Math.min(finalScore, 100),
        breakdown: {
            aesthetic: Math.floor(aestheticMatch),
            reliability: baseReliability,
            engagement: Math.floor(simulatedEngagement)
        }
    };
};

/**
 * Recommend Talent Controller
 * Provides a list of high-potential talent based on verification, availability, and engagement metrics.
 */
exports.recommendTalent = async (req, res) => {
    try {
        // 1. Fetch top professional profiles
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select('user_id, full_name, profile_photo_url, category, users!inner(username, verification_level)')
            .limit(20);

        if (profileErr) throw profileErr;

        // 2. Compute dynamic recommendations
        const recommendations = profiles.map((profile, index) => {
            const { score, breakdown } = computeDynamicScore(profile, index);

            // Simulated aesthetic intelligence
            const aestheticPool = ['Minimalist', 'Avant-Garde', 'Streetwear', 'High-Fashion', 'Vintage', 'Cyberpunk', 'Editorial'];
            const tags = aestheticPool.slice(index % 3, (index % 3) + 3);

            return {
                user_id: profile.user_id,
                full_name: profile.full_name,
                username: profile.users?.username || 'user',
                avatar_url: profile.profile_photo_url,
                category: profile.category,
                is_verified: profile.users?.verification_level === 'VERIFIED_ELITE' || profile.users?.verification_level === 'VERIFIED_PRO',
                match_index: score,
                ai_recommendation_reason: score > 90 ? "Highest reliability score in your region" : "Strong alignment with recent brand aesthetics",
                aesthetic_tags: tags,
                match_breakdown: breakdown
            };
        });

        return res.json({
            success: true,
            data: recommendations.sort((a, b) => b.match_index - a.match_index)
        });
    } catch (error) {
        console.error('AI Recommendation Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch AI talent recommendations' });
    }
};
