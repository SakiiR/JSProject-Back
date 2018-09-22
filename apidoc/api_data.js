define({ "api": [
  {
    "type": "delete",
    "url": "/auth/rooms/:id",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back-new-version/node_modules/koa-smart/dist/ApiDocTmp/auth/rooms/-id.js",
    "groupTitle": "Auth",
    "name": "DeleteAuthRoomsId"
  },
  {
    "type": "get",
    "url": "/auth/rooms/:id/messages",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "C:/Users/Pierrick/JSProject-Back-new-version/node_modules/koa-smart/dist/ApiDocTmp/auth/rooms/-id/messages.js",
    "groupTitle": "Auth",
    "name": "GetAuthRoomsIdMessages"
  },
  {
    "type": "post",
    "url": "/auth/rooms",
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
    "filename": "C:/Users/Pierrick/JSProject-Back-new-version/node_modules/koa-smart/dist/ApiDocTmp/auth/rooms.js",
    "groupTitle": "Auth",
    "name": "PostAuthRooms"
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
    "filename": "C:/Users/Pierrick/JSProject-Back-new-version/node_modules/koa-smart/dist/ApiDocTmp/Index.js",
    "groupTitle": "Index",
    "name": "Get"
  }
] });
