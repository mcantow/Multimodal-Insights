#  THIS script downloads certificates for you production instance
#  MAKE sure to add you domain name(s) to the variable in line 9

#!/bin/bash

################################################################################
# PUT YOUR DOMAIN NAMES IN #####################################################
################################################################################e
domains=(multimodalinsights.com www.multimodalinsights.com) # <- HERE          #
################################################################################

if ! [ -x "$(command -v docker compose)" ]; then
  echo 'Error: docker compose is not installed.' >&2
  exit 1
fi

# install 
apt-get update
sudo apt-get install certbot
apt-get install python3-certbot-nginx

# sudo certbot --nginx -d example.com -d www.example.com

# Prepare the certbot command with -d arguments
certbot_command="sudo certbot --nginx"

# Iterate over the domain names and add them as -d arguments
for domain in "${domains[@]}"; do
  certbot_command+=" -d $domain"
done

# Execute the certbot command
eval "$certbot_command"

# #!/bin/bash

# # if ! [ -x "$(command -v docker-compose)" ]; then
# #   echo 'Error: docker-compose is not installed.' >&2
# #   exit 1
# # fi

# domains=(multimodalinsights.com www.multimodalinsights.com)
# rsa_key_size=4096
# data_path="./data/certbot"
# email="mcantow@mit.edu" # Adding a valid address is strongly recommended
# staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

# if [ -d "$data_path" ]; then
#   read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
#   if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
#     exit
#   fi
# fi


# if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
#   echo "### Downloading recommended TLS parameters ..."
#   mkdir -p "$data_path/conf"
#   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
#   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
#   echo
# fi

# echo "### Creating dummy certificate for $domains ..."
# path="/etc/letsencrypt/live/$domains"
# mkdir -p "$data_path/conf/live/$domains"
# docker compose run --rm --entrypoint "\
#   openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
#     -keyout '$path/privkey.pem' \
#     -out '$path/fullchain.pem' \
#     -subj '/CN=localhost'" certbot
# echo


# echo "### Starting nginx ..."
# docker compose up --force-recreate -d nginx
# echo

# echo "### Deleting dummy certificate for $domains ..."
# docker compose run --rm --entrypoint "\
#   rm -Rf /etc/letsencrypt/live/$domains && \
#   rm -Rf /etc/letsencrypt/archive/$domains && \
#   rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
# echo


# echo "### Requesting Let's Encrypt certificate for $domains ..."
# #Join $domains to -d args
# domain_args=""
# for domain in "${domains[@]}"; do
#   domain_args="$domain_args -d $domain"
# done

# # Select appropriate email arg
# case "$email" in
#   "") email_arg="--register-unsafely-without-email" ;;
#   *) email_arg="--email $email" ;;
# esac

# # Enable staging mode if needed
# if [ $staging != "0" ]; then staging_arg="--staging"; fi

# docker compose run --rm --entrypoint "\
#   certbot certonly --webroot -w /var/www/certbot \
#     $staging_arg \
#     $email_arg \
#     $domain_args \
#     --rsa-key-size $rsa_key_size \
#     --agree-tos \
#     --force-renewal" certbot
# echo

# echo "### Reloading nginx ..."
# docker compose exec nginx nginx -s reload