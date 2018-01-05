#!/bin/bash
# create negative image zips from faces94 images
 
 YELLOW='\033[1;33m'
 RED='\033[1;31m'
 GREEN='\033[1;32m'
 RESET='\033[0m'

# indent text on echo
function indent() {
  c='s/^/       /'
  case $(uname) in
    Darwin) sed -l "$c";;
    *)      sed -u "$c";;
  esac
}

# displays where we are, uses the indent function (above) to indent each line
function showStep ()
    {
        echo -e "${YELLOW}=====================================================" | indent
        echo -e "${RESET}-----> $*" | indent
        echo -e "${YELLOW}=====================================================${RESET}" | indent
    }

# Grab the current directory
function getCurrent() 
    {
        showStep "getting current directory"
        DIR="$( pwd )"
        echo "DIR in getCurrent is: ${DIR}"
        THIS_SCRIPT=`basename "$0"`
        showStep "Running '${THIS_SCRIPT}'"
    }
declare basePath='images'
declare negBase='faces94'
declare -a folders=('male' 'female')
declare posZip="${2}"
declare curl_cmd="curl -X POST -F \"${2}_positive_examples=@${2}.zip\""
declare api_key="${1}"
declare url="https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?api_key=${api_key}&version=2016-05-20"
showStep "image folders are located here: ${basePath}/${negBase}"
for i in "${folders[@]}"
do 
    showStep "Processing folders in ${basePath}/${negBase}/${i}"
    pushd "${basePath}/${negBase}/${i}"
    declare -a currentSet=($(ls -d -- */))
    # echo "current path is ${PWD}"
    # echo "${currentSet}"
    popd
    # echo "current path is ${PWD}"
    for j in "${currentSet[@]}"
    do
        let len=${#j}-1
#        echo "Creating zip from images in ${basePath}/${negBase}/${i}/${j}"
#        zip images/"${j:0:len}".zip "${basePath}/${negBase}/${i}/${j:0:len}"/*.jpg -q
#        copy first image from each folder to ${i}
        cp "${basePath}/${negBase}/${i}/${j:0:len}"/"${j:0:len}".1.jpg "${basePath}/${negBase}/${i}"/"${j:0:len}".1.jpg
#        curl_cmd+=" -F \"${j:0:len}_positive_examples=@${j:0:len}.zip\""
    done
        showStep  "Creating zip from images in ${basePath}/${negBase}/${i}"
        zip images/"${i}".zip "${basePath}/${negBase}/${i}"/*.jpg -q
        rm ${basePath}/${negBase}/${i}/*.jpg
    curl_cmd+=" -F \"${i}_positive_examples=@${i}.zip\""
done

curl_cmd+=" -F \"name=visualAuthenticate\" \"${url}\"" 

showStep " about to execute this command to create your classifier: \n $curl_cmd"
pushd "${basePath}"
declare vr_classifier_id=$(eval $curl_cmd | jq '.classifier_id')
# eval $curl_cmd
showStep "Save this classifier id ==>${RED}${vr_classifier_id}${RESET}<== to your env.json file"
showStep "You can check the status of your classifier by executing the following command, you're looking for a 'ready' state'\n${RED}curl -X GET \"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/${vr_classifier_id}?api_key=${api_key}&version=2016-05-20\"${RESET}"
popd

# curl -X GET "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/dogs_1477088859?api_key=${api_key}&version=2016-05-20"
# curl -X GET "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/visualAuthenticate_1048061842?api_key=a1107d9d670354018cf2d899ba8740c4855f466a&version=2016-05-20"
