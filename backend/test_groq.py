from groq import Groq
import os

# Test if Groq is working
api_key = "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"

try:
    client = Groq(api_key=api_key)
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say 'Hello, Groq is working!' in JSON format with a 'message' key."}
        ],
        temperature=0.3,
        max_tokens=50
    )
    
    print("SUCCESS! Groq is working!")
    print("Response:", response.choices[0].message.content)
    
except Exception as e:
    print(f"ERROR: {e}")
