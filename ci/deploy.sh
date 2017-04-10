#!/bin/bash

cd build/NextCardGame

# zip all architectures
for arch in * ; do
    if [[ -d $arch ]]; then
        echo "zip $arch.zip"

        pushd $arch
        zip -9 -r ../$CI_COMMIT_REF_NAME-$arch.zip .
        popd
    fi
done

# create html5 version
mkdir html5
cp ../../*.html html5/
cp ../../js html5/
cp ../../css html5/

# init ssh
eval $(ssh-agent -s)
ssh-add <(echo "$SSH_PRIVATE_KEY")
mkdir -p ~/.ssh
[[ -f /.dockerenv ]] && echo "$SSH_SERVER_HOSTKEYS" > ~/.ssh/known_hosts

# upload builds
scp *.zip deploy@builds.et.tc:/var/www/et.tc/Builds/next-card-game/
# upload html5
scp -r html5 deploy@builds.et.tc:/var/www/et.tc/Builds/next-card-game/$CI_COMMIT_REF_NAME-html5
