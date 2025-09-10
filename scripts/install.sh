#!/usr/bin/bash

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
  apt update
  apt install -y curl dirmngr apt-transport-https lsb-release ca-certificates
  curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  apt install -y nodejs
EOF