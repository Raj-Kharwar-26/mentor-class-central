
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
    
    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Video ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Verify token and get user session
    const { data: { session }, error: authError } = await supabaseAdmin.auth.getSession();
    if (authError || !session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const userId = session.user.id;
    
    // Get video data
    const { data: videoData, error: videoError } = await supabaseAdmin
      .from('videos')
      .select(`
        *,
        courses!inner(
          tutor_id
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
    
    // Get signed URL (valid for a short time)
    const videoPath = videoData.video_url.replace(/^.*\/storage\/v1\/object\/public\/videos\//, '');
    const { data: { signedUrl }, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('videos')
      .createSignedUrl(videoPath, 60 * 60); // Valid for 1 hour
    
    if (signedUrlError || !signedUrl) {
      return new Response(JSON.stringify({ error: 'Failed to generate secure URL' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Return the signed URL
    return new Response(JSON.stringify({ url: signedUrl }), {
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
