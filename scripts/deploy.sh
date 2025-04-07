#!/usr/bin/bash
npm run build;

scp -r \
    dist/ \
    database/ \
    .env \
    favicon.ico \
    package-lock.json \
    package.json \
    src/ \
    tsconfig.json \
    root@vps56603.publiccloud.com.br:/opt/backlinio/;

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
    npm --prefix /opt/backlinio/ i;
    mkdir -p /opt/backlinio/public/uploads;
    chmod 750 -R /opt/backlinio;
    chmod 660 -R /opt/backlinio/public/uploads;
    chmod 770 /opt/backlinio/public/uploads;
    screen -X -S strapi quit;
    screen -S strapi -dm npm --prefix /opt/backlinio/ run start;
EOF
