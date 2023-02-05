version=$(echo $(echo $(sudo curl -X GET https://api.github.com/repos/BetterLectio/betterLectio/releases/latest) | grep -Po '"tag_name":.*?[^\\]",') | grep -Po "\d+.\d+.\d+")
echo $version
wget https://github.com/BetterLectio/betterLectio/releases/download/$version/BetterLectio-$version.AppImage
sudo mkdir /usr/share/betterlectio/
sudo mv BetterLectio-$version.AppImage /usr/share/betterlectio/

sudo mkdir /usr/share/app-logos/
wget https://raw.githubusercontent.com/BetterLectio/betterLectio/main/static/favicon.png --output-document=betterlectio.png
sudo mv betterlectio.png /usr/share/app-logos/

wget https://raw.githubusercontent.com/BetterLectio/betterLectio/dev/buildData/betterlectio.desktop
sudo mv betterlectio.desktop /usr/share/applications/