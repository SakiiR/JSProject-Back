define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/auth/login.js",
    "groupTitle": "Auth",
    "name": "PostAuthLogin"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/auth/register.js",
    "groupTitle": "Auth",
    "name": "PostAuthRegister"
  },
  {
    "type": "get",
    "url": "/",
    "title": "",
    "group": "Index",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/Index.js",
    "groupTitle": "Index",
    "name": "Get"
  },
  {
    "type": "delete",
    "url": "/message/:id",
    "title": "",
    "group": "Message",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/message/-id.js",
    "groupTitle": "Message",
    "name": "DeleteMessageId"
  },
  {
    "type": "delete",
    "url": "/room/:id",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/-id.js",
    "groupTitle": "Room",
    "name": "DeleteRoomId"
  },
  {
    "type": "get",
    "url": "/room/:id/messages",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/-id/messages.js",
    "groupTitle": "Room",
    "name": "GetRoomIdMessages"
  },
  {
    "type": "post",
    "url": "/room",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "private",
            "description": "<p>It should be a boolean or one of: (&quot;true&quot;, &quot;false&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room.js",
    "groupTitle": "Room",
    "name": "PostRoom"
  },
  {
    "type": "post",
    "url": "/room/:id/message",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/sakiir/workspace/EPITECH/JavascriptFullStack/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/-id/message.js",
    "groupTitle": "Room",
    "name": "PostRoomIdMessage"
  }
] });
