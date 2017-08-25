if [ ! $1 ]; 
	then echo 'You are forgot the description'
	else code-push release-react MusicMonitor ios -m --description "$1"; code-push release-react MusicMonitor android -m --description "$1"
fi;