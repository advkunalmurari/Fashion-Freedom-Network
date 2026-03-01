const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEMO_USERS = [
    {
        email: `demo.editorial.${Date.now()}@ffn.world`,
        password: 'Password123!',
        data: {
            username: 'milan_archives',
            displayName: 'Milan Editorial',
            role: 'POST',
            isPremium: true,
            bio: '[DEMO] Curating the best of Milan fashion week and editorial shoots.',
            location: 'Milan, Italy',
            avatarUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1541334865516-41fbbd09b68a?auto=format&fit=crop&w=1200'
        }
    },
    {
        email: `demo.runway.${Date.now()}@ffn.world`,
        password: 'Password123!',
        data: {
            username: 'paris_runway',
            displayName: 'Paris Runway',
            role: 'MODEL',
            isPremium: false,
            bio: '[DEMO] Capturing motion and avant-garde designs on the catwalk.',
            location: 'Paris, France',
            avatarUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200'
        }
    },
    {
        email: `demo.streetwear.${Date.now()}@ffn.world`,
        password: 'Password123!',
        data: {
            username: 'tokyo_street',
            displayName: 'Tokyo Streetwear',
            role: 'PHOTOGRAPHER',
            isPremium: true,
            bio: '[DEMO] Documenting the intersection of culture and high-end streetwear.',
            location: 'Tokyo, Japan',
            avatarUrl: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200'
        }
    }
];

const DEMO_POSTS = [
    {
        userIndex: 0,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800'],
        caption: 'Milan Fashion Week opening night. 📸 #MFW #Editorial',
        shootType: 'editorial',
        brandTag: 'Prada',
        likes: 2450,
        comments: 142
    },
    {
        userIndex: 0,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800'],
        caption: 'Studio sessions. The interplay of shadow and structure.',
        shootType: 'editorial',
        likes: 1890,
        comments: 54
    },
    {
        userIndex: 1,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1502163140606-888448ae8cbc?auto=format&fit=crop&w=800'],
        caption: 'Backstage energy before the final walk. 🚶‍♀️✨ #Runway',
        shootType: 'runway',
        likes: 4200,
        comments: 312
    },
    {
        userIndex: 1,
        type: 'VIDEO',
        mediaUrls: ['https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'], // Demo video
        caption: 'Capturing the flow. #Motion #FashionWeek',
        shootType: 'runway',
        likes: 5600,
        comments: 420
    },
    {
        userIndex: 2,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1550614000-4b95d4edae1c?auto=format&fit=crop&w=800'],
        caption: 'Shibuya nights. Neo-Tokyo streetwear aesthetics.',
        shootType: 'streetwear',
        likes: 3100,
        comments: 89
    },
    {
        userIndex: 2,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&w=800'],
        caption: 'Layering masterclass. Winter essentials.',
        shootType: 'commercial',
        likes: 1200,
        comments: 42
    },
    {
        userIndex: 0,
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800'],
        caption: 'Vogue Archives: Unseen 1999',
        shootType: 'editorial',
        likes: 8900,
        comments: 530
    }
];

async function seed() {
    console.log("Starting Demo Content Seeding...");

    const createdUsers = [];

    for (let u of DEMO_USERS) {
        let userId = null;
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true
        });

        if (authError) {
            if (authError.message.includes("already been registered") || authError.code === 'email_exists' || authError.message.includes('Unexpected token')) {
                console.log(`User ${u.email} already exists or error bypassing. Attempting to fetch their ID.`);
                const { data } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = data?.users?.find(user => user.email === u.email);

                if (existingUser) {
                    userId = existingUser.id;
                } else {
                    console.error("Auth Error for", u.email, authError);
                    continue;
                }
            } else {
                console.error("Auth Error for", u.email, authError);
                continue;
            }
        } else {
            userId = authData?.user?.id;
        }

        if (!userId) {
            console.error("No userId found for", u.email);
            continue;
        }

        const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
            id: userId,
            user_id: userId,
            full_name: u.data.displayName,
            profile_photo_url: u.data.avatarUrl,
            cover_photo_url: u.data.coverUrl,
            category: u.data.role,
            is_premium: u.data.isPremium,
            bio: u.data.bio,
            location: u.data.location
        }, { onConflict: 'id' });

        if (profileError) {
            console.error("Profile Error for", u.email, profileError);
        } else {
            console.log(`Successfully upserted user: ${u.data.displayName}`);
            createdUsers.push(userId);
        }
    }

    if (createdUsers.length === 0) {
        console.error("No users created to associate posts with.");
        return;
    }

    console.log("Seeding Posts...");

    for (let p of DEMO_POSTS) {
        const authorId = createdUsers[p.userIndex];
        if (!authorId) continue;

        const { error: postError } = await supabaseAdmin.from('posts').insert({
            author_id: authorId,
            caption: p.caption,
            media_url: p.mediaUrls[0],
            type: p.type,
            shoot_type: p.shootType,
            brand_tag: p.brandTag,
            tags: ['demo_content'],
            // Randomize creation date over the last 30 days
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (postError) {
            console.error("Post Error:", postError);
        } else {
            console.log("Post inserted.");
        }
    }

    console.log("Seeding Complete. Auto-generating fake likes to bypass schema constraints...");

    for (let i = 0; i < 50; i++) {
        const randomPostIdx = Math.floor(Math.random() * DEMO_POSTS.length);
        const randomUserIdx = Math.floor(Math.random() * DEMO_USERS.length);

        const { data: pData } = await supabaseAdmin.from('posts').select('id').eq('caption', DEMO_POSTS[randomPostIdx].caption).limit(1).single();
        if (pData && createdUsers[randomUserIdx]) {
            await supabaseAdmin.from('likes').upsert({
                post_id: pData.id,
                user_id: createdUsers[randomUserIdx]
            }).catch(() => { });
        }
    }

    console.log("Done.");
}

seed().catch(console.error);
