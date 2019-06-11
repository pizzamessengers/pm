for (( i=1; i <= 4; i++ ))
do
    /usr/local/php/cgi/7.2/bin/php ~/dmitrilya.beget.tech/laravel/artisan schedule:run
    sleep 15
done
