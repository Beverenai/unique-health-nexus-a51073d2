
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

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
    // Get the request body
    const { message, context, userId } = await req.json();
    
    // Initialize OpenAI client
    const configuration = new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    const openai = new OpenAIApi(configuration);

    // Create system message based on context
    let systemMessage = "You are a helpful health assistant in a Norwegian health app called 'Koherens'. ";
    systemMessage += "You provide information about health, respond to questions, and help users understand their health data.";
    
    // Add context-specific information to system message
    if (context) {
      if (context.route === "/history") {
        systemMessage += " The user is currently viewing their health history page which shows their coherence scores over time.";
        if (context.coherenceData && context.coherenceData.length > 0) {
          systemMessage += ` Their latest coherence score is ${context.coherenceData[0].score}%.`;
        }
      } else if (context.route.includes("/issue/")) {
        systemMessage += " The user is currently viewing a specific health issue.";
        if (context.issueDetails) {
          systemMessage += ` The issue they're looking at is: ${context.issueDetails.name} - ${context.issueDetails.description}`;
        }
      } else if (context.route.includes("/health-system/")) {
        systemMessage += " The user is currently viewing information about a specific health system in their body.";
        if (context.systemDetails) {
          systemMessage += ` They're looking at the ${context.systemDetails.area} system, which has the following symptoms: ${context.systemDetails.symptoms}`;
        }
      }
    }
    
    systemMessage += " Provide helpful, accurate information in Norwegian. Be concise yet informative.";

    // Generate response from OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = response.data.choices[0]?.message?.content || "Beklager, jeg kunne ikke generere et svar.";

    // Save the AI response to the database
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase
        .from('chat_messages')
        .insert({ 
          user_id: userId,
          message: aiResponse,
          is_user: false,
          context: context
        });
    }

    return new Response(
      JSON.stringify({
        message: aiResponse
      }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        }
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred processing your request" }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
