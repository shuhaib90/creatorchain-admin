from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import asyncio
# Assuming Scweet is cloned in the same directory or accessible
# from Scweet.scweet import Scweet

app = Flask(__name__)
CORS(app) # Enable CORS for frontend requests

CONFIG_PATH = 'config.json'

def get_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f)
    return {"auth_token": ""}

@app.route('/api/verify', methods=['POST'])
async def verify_profile():
    data = request.json
    handle = data.get('handle', '').replace('@', '')
    
    config = get_config()
    auth_token = config.get('auth_token')
    
    if not auth_token:
        return jsonify({"error": "No auth_token provided in api/config.json"}), 400

    try:
        # Mocking Scweet call for local setup
        # In actual use, this would be:
        # scraper = Scweet(auth_token=auth_token)
        # user_data = await scraper.aget_user(username=handle)
        
        # Simulating data fetching for local host demonstration
        print(f"Scraping profile for: {handle}")
        
        # Return mock data as a placeholder until dependencies are installed
        return jsonify({
            "success": True,
            "data": {
                "handle": handle,
                "name": f"{handle.capitalize()} (Verified)",
                "followers": 12500,
                "is_verified": True,
                "profile_img": f"https://unavatar.io/twitter/{handle}"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
