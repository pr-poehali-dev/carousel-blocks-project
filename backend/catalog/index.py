'''
Business: Fetch catalog items with pagination and tag filtering
Args: event with queryStringParameters (page, limit, tag)
Returns: HTTP response with catalog items array and pagination info
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        page = int(params.get('page', '1'))
        limit = int(params.get('limit', '12'))
        tag = params.get('tag')
        
        offset = (page - 1) * limit
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if tag:
            cur.execute(
                "SELECT COUNT(*) as total FROM catalog_items WHERE %s = ANY(tags)",
                (tag,)
            )
            total_result = cur.fetchone()
            total = total_result['total'] if total_result else 0
            
            cur.execute(
                "SELECT id, title, tags, image_url_1, image_url_2, image_url_3, external_link FROM catalog_items WHERE %s = ANY(tags) ORDER BY position DESC, id DESC LIMIT %s OFFSET %s",
                (tag, limit, offset)
            )
        else:
            cur.execute("SELECT COUNT(*) as total FROM catalog_items")
            total_result = cur.fetchone()
            total = total_result['total'] if total_result else 0
            
            cur.execute(
                "SELECT id, title, tags, image_url_1, image_url_2, image_url_3, external_link FROM catalog_items ORDER BY position DESC, id DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )
        
        items = cur.fetchall()
        
        cur.execute("SELECT DISTINCT unnest(tags) as tag FROM catalog_items ORDER BY tag")
        all_tags = [row['tag'] for row in cur.fetchall()]
        
        cur.close()
        conn.close()
        
        items_formatted = [
            {
                'id': item['id'],
                'title': item['title'],
                'tags': item['tags'],
                'images': [item['image_url_1'], item['image_url_2'], item['image_url_3']],
                'link': item['external_link']
            }
            for item in items
        ]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'items': items_formatted,
                'total': total,
                'page': page,
                'limit': limit,
                'totalPages': (total + limit - 1) // limit,
                'allTags': all_tags
            }),
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
