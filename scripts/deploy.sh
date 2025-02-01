#!/usr/bin/bash
npm run build;

scp -r \
    dist/ \
    database/ \
    .env \
    favicon.ico \
    package-lock.json \
    package.json \
    public/ \
    src/ \
    tsconfig.json \
    root@vps56603.publiccloud.com.br:/opt/backlinio/;

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
    npm --prefix /opt/backlinio/ i;
    chmod 755 -R /opt/backlinio/dist/ /opt/backlinio/node_modules/;
    screen -S strapi -dm npm run start;
EOF
