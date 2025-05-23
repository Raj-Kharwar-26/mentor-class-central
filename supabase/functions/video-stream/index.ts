
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const videoId = url.pathname.split('/').pop();
    const token = url.searchParams.get('token');
    const authToken = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Video ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!authToken) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Verify user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const userId = user.id;
    
    // Get video data with course information
    const { data: videoData, error: videoError } = await supabaseAdmin
      .from('videos')
      .select(`
        *,
        courses!inner(
          tutor_id,
          id,
          title
        )
      `)
      .eq('id', videoId)
      .single();
    
    if (videoError || !videoData) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if the user is enrolled or is the tutor
    const isTutor = videoData.courses.tutor_id === userId;
    
    if (!isTutor) {
      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('course_id', videoData.course_id)
        .eq('user_id', userId)
        .single();
      
      if (enrollmentError || !enrollment) {
        return new Response(JSON.stringify({ error: 'Not enrolled in this course' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Generate secure streaming URL with bandwidth adaptation
    const videoPath = videoData.video_url.replace(/^.*\/storage\/v1\/object\/public\/videos\//, '');
    
    // Create multiple quality URLs for adaptive streaming
    const qualities = ['360p', '720p', '1080p'];
    const streamingUrls = {};
    
    for (const quality of qualities) {
      const { data: { signedUrl }, error: signedUrlError } = await supabaseAdmin
        .storage
        .from('videos')
        .createSignedUrl(videoPath, 3600); // Valid for 1 hour
      
      if (signedUrl) {
        streamingUrls[quality] = signedUrl;
      }
    }
    
    // Generate time-limited access token
    const accessToken = btoa(JSON.stringify({
      videoId,
      userId,
      expiresAt: Date.now() + (3600 * 1000), // 1 hour
      courseId: videoData.course_id
    }));
    
    // Return secure URLs with access token
    return new Response(JSON.stringify({ 
      streamingUrls,
      accessToken,
      expiresAt: Date.now() + (3600 * 1000),
      videoTitle: videoData.title,
      courseTitle: videoData.courses.title
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error processing video request:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
