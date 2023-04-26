FROM php:8.1-fpm


RUN apt-get update && apt-get install -yq gnupg && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash -  && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -yq libicu-dev libzip-dev git nodejs yarn wget && \
    docker-php-ext-install intl zip pdo pdo_mysql

# Symfony
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash \
    && apt install symfony-cli

# XDebug
RUN apt-get install libpq-dev -y

RUN pecl install xdebug && \
    docker-php-ext-enable xdebug

RUN touch /var/log/xdebug.log

RUN chown www-data:www-data /var/log/xdebug.log && \
    chmod 777 /var/log/xdebug.log

COPY .docker/app/php.ini /usr/local/etc/php/conf.d/

# Clean
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN usermod -u 1000 www-data

# Change ownership of /var/www directory
RUN mkdir /var/www/.cache
RUN touch /var/www/.cache/yarn

RUN chown -R www-data:www-data /var/www

USER 1000

WORKDIR /var/www/html

CMD ["php-fpm"]

