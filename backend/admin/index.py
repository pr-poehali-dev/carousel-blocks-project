'''
Business: Admin operations - create users and add catalog items
Args: event with httpMethod POST, body with action (create_user or add_item) and data
Returns: HTTP response with operation result
'''

import json
import os
import hashlib
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'create_user':
            username = body_data.get('username')
            password = body_data.get('password')
            
            if not username or not password:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Username and password required'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(password)
            
            cur.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING id",
                (username, password_hash)
            )
            result = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'user_id': result['id']}),
                'isBase64Encoded': False
            }
        
        elif action == 'add_item':
            title = body_data.get('title')
            tags = body_data.get('tags', [])
            images = body_data.get('images', [])
            link = body_data.get('link')
            
            if not title or len(images) < 3 or not link:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Title, 3 images, and link required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT COALESCE(MAX(position), 0) + 1 as new_position FROM catalog_items")
            position_result = cur.fetchone()
            new_position = position_result['new_position']
            
            cur.execute(
                "INSERT INTO catalog_items (title, tags, image_url_1, image_url_2, image_url_3, external_link, position) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (title, tags, images[0], images[1], images[2], link, new_position)
            )
            result = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'item_id': result['id']}),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
