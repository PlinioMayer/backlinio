#!/usr/bin/bash

if [[ ! "$(git status)" =~ 'nothing to commit, working tree clean' ]]; then
    echo "Aquela commitada ajuda";
    exit 1;
fi

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
  apt update
  apt install -y curl screen snapd nginx dirmngr apt-transport-https lsb-release ca-certificates
  systemctl restart snapd
  curl -sL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
  npm i -g yarn
  snap install --classic certbot
  ln -s /snap/bin/certbot /usr/bin/certbot
  echo vps56603.publiccloud.com.br | certbot --agree-tos -m pctmayer@gmail.com
EOF

