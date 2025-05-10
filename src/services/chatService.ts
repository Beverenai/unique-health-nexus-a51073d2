
import { supabase } from "@/integrations/supabase/client";

// Demo user ID to use when not authenticated
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Helper function to get the current user ID or fallback to demo user
const getUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || DEMO_USER_ID;
};

export const sendChatMessage = async (message: string, context: any = null, isUser = true): Promise<{success: boolean, data?: any}> => {
  try {
    const userId = await getUserId();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ 
        user_id: userId,
        message,
        is_user: isUser,
        context: context
      })
      .select();

    if (error) {
      console.error('Error sending chat message:', error);
      return { success: false };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    return { success: false };
  }
};

export const getChatMessages = async (): Promise<any[]> => {
  try {
    const userId = await getUserId();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return [];
  }
};

export const sendMessageToAI = async (message: string, context: any = null): Promise<string> => {
  try {
    const userId = await getUserId();

    // First save the user message
    await sendChatMessage(message, context, true);

    // Send the message to the AI via our edge function
    const response = await fetch('https://jondlbgouhsdedhdnwpx.functions.supabase.co/chat-with-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        message,
        context,
        userId
      })
    });

    if (!response.ok) {
      throw new Error(`Error from API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save the AI response to the database
    await sendChatMessage(data.message, context, false);
    
    return data.message;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    return "Beklager, det oppsto en feil ved kommunikasjon med AI-assistenten.";
  }
};
