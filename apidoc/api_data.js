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
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/auth/login.js",
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
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/auth/register.js",
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
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/Index.js",
    "groupTitle": "Index",
    "name": "Get"
  },
  {
    "type": "delete",
    "url": "/message/messages/:id",
    "title": "",
    "group": "Message",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/message/messages/-id.js",
    "groupTitle": "Message",
    "name": "DeleteMessageMessagesId"
  },
  {
    "type": "post",
    "url": "/message/messages",
    "title": "",
    "group": "Message",
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
            "type": "Number",
            "optional": false,
            "field": "from",
            "description": "<p>It should be a number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "room",
            "description": "<p>It should be a number.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/message/messages.js",
    "groupTitle": "Message",
    "name": "PostMessageMessages"
  },
  {
    "type": "delete",
    "url": "/room/rooms/:id",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/rooms/-id.js",
    "groupTitle": "Room",
    "name": "DeleteRoomRoomsId"
  },
  {
    "type": "get",
    "url": "/room/rooms/:id/messages",
    "title": "",
    "group": "Room",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/rooms/-id/messages.js",
    "groupTitle": "Room",
    "name": "GetRoomRoomsIdMessages"
  },
  {
    "type": "post",
    "url": "/room/rooms",
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
            "type": "Number",
            "optional": false,
            "field": "creator",
            "description": "<p>It should be a number.</p>"
          },
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
            "optional": false,
            "field": "description",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back/node_modules/koa-smart/dist/ApiDocTmp/room/rooms.js",
    "groupTitle": "Room",
    "name": "PostRoomRooms"
  }
] });
