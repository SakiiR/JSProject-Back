#!/bin/bash

USERNAME=$1
PASSWORD=$2

TOKEN=$(http ':1337/auth/login' "username=$USERNAME" "password=$PASSWORD" | jq -r '.data.user.token')

echo $TOKEN
