#!/usr/bin/bash

if [[ ! "$(git status)" =~ 'nothing to commit, working tree clean' ]]; then
    echo "Aquela commitada ajuda";
    exit 1;
fi

npm run build;

scp -r \
    dist/ \
    database/ \
    .env \
    favicon.ico \
    package.json \
    yarn.lock \
    src/ \
    tsconfig.json \
    root@vps56603.publiccloud.com.br:/opt/backlinio/;

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
    yarn --cwd /opt/backlinio/;
    screen -X -S strapi quit;
    screen -dmS strapi yarn --cwd /opt/backlinio/ start;
EOF
