#!/usr/bin/bash
npm run build;

scp -r \
    dist/ \
    .env \
    favicon.ico \
    package-lock.json \
    package.json \
    public/ \
    src/ \
    tsconfig.json \
    root@vps56603.publiccloud.com.br:/opt/backlinio/;

ssh root@vps56603.publiccloud.com.br "/usr/bin/bash -s" << EOF
    chmod 640 -R /opt/backlinio/;
    npm --prefix /opt/backlinio/ i;
    chmod 750 -R /opt/backlinio/dist/ /opt/backlinio/node_modules/;
EOF
