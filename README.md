### .env sample

```
#
# APPLICATION
#
APP_NAME=ics
APP_PORT=3001
APP_CORS_ORIGINS=http://localhost:3000,https://ics.dev.sisoul.kr
APP_WEB_URL=https://ics.dev.sisoul.kr
APP_WEB_DEV_URL=http://localhost:3001
APP_DEFAULT_TENANCY=sisoul

#
# AUTH
#
AUTH_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

#
# MYSQL
#
MYSQL_SCHEMA=adhoc
MYSQL_PORT=3306

MYSQL_READ_HOST=127.0.0.1
MYSQL_READ_USERNAME=adhoc
MYSQL_READ_PASSWORD=xxxxxxxxxxx

MYSQL_WRITE_HOST=127.0.0.1
MYSQL_WRITE_USERNAME=adhoc
MYSQL_WRITE_PASSWORD=xxxxxxxxxxx


#
# Core
#
CORE_ITEM_API=https://core.ics.dev.sisoul.kr/items
CORE_ORDER_API=https://core.ics.dev.sisoul.kr/orders

#
# Qoo10
# QOO10_URL=https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi
#
QOO10_URL=112.170.6.254:5600/GMKT.INC.Front.QAPIService/ebayjapan.qapi
QOO10_APP_VERSION=1.0
QOO10_APP_RETURNTYPE=JSON
QOO10_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
QOO10_USER=cocenkr // 임시로 유저명을 입력함.

#
# rakuten Key
#
RAKUTEN_SERVICE_SECRECT=xxxxxxxxxxxxxxxxxxxxxxxxx
RAKUTEN_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
RAKUTEN_BASE_URL=https://api.rms.rakuten.co.jp/es/

#
# google
#
GOOGLE_PROJECT_NAME='ics-translation'
GOOGLE_LOCATION='global'

#
# aws ses
#
SES_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
SES_ACCESS_KEY=xxxxxxxxxxxxxxxxx
AWS_SES_SENDER=xxx@sisoul.kr
AWS_SES_RECEIVER_DOMAINS=sisoul.co.kr,gmail.com
AWS_REGION=ap-northeast-2

#
# aws s3
#
AWS_S3_TEMPLATE_BUCKET=sisoul-ics-adhoc
AWS_S3_TEMPLATE_DIR=email-templates

#
# korea exim bank
#
KOREA_EXIM_BANK_BASE_URL=https://www.koreaexim.go.kr/site/program/financial/
KOREA_EXIM_BANK_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx

#
# Sagawa
#
SAGAWA_TRACKING_URL=https://k2k.sagawa-exp.co.jp/cgi-bin/mall.mmcgi

#
# Yamato
#
YAMATO_TRACKING_URL=https://toi.kuronekoyamato.co.jp/cgi-bin/tneko

#
# usps
#
USPS_TRACKING_URL=https://tools.usps.com/go/TrackConfirmAction_input

#
# agente
#
AGENTE_SERVICE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
AGENTE_URL=https://swww.agente.co.kr/agente/api
# AGENTE_URL=https://www.agente.co.kr/agente/api

```

### CREATE MySQL

```
CREATE TABLE IF NOT EXISTS `categories` (
  `_id` BIGINT NOT NULL AUTO_INCREMENT,
  `main_category_code` VARCHAR(100) NULL,
  `main_category_name` VARCHAR(100) NULL,
  `middle_category_code` VARCHAR(100) NULL,
  `middle_category_name` VARCHAR(100) NULL,
  `sub_category_code` VARCHAR(100) NULL,
  `sub_category_name` VARCHAR(100) NULL,
  `market_place` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `items` (
  `_id` BIGINT NOT NULL AUTO_INCREMENT,
  `categories_id` BIGINT NOT NULL,
  `item_no` VARCHAR(100) NOT NULL,
  `status` VARCHAR(100) NULL,
  `name` VARCHAR(100) NOT NULL,
  `quantity` BIGINT NOT NULL,
  `price` BIGINT NOT NULL,
  `retail_price` BIGINT NOT NULL,
  `settle_price` BIGINT NOT NULL,
  `adult` ENUM('1', '0') NULL,
  `url` VARCHAR(200) NULL,
  `detail` MEDIUMTEXT NULL,
  `market_place` VARCHAR(100) NOT NULL,
  `seller_code` VARCHAR(100) NULL,
  `seller_name` VARCHAR(100) NULL,
  `seller_tel` VARCHAR(100) NULL,
  `brand_code` VARCHAR(100) NULL,
  `brand_name` VARCHAR(100) NULL,
  `shipping_code` VARCHAR(100) NULL,
  `expired_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  INDEX `fk_items_categories1_idx` (`categories_id` ASC) VISIBLE,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `orders` (
  `order_no` VARCHAR(100) NOT NULL,
  `market_place` VARCHAR(100) NOT NULL,
  `seller_name` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`order_no`),
  UNIQUE INDEX `order_no_UNIQUE` (`order_no` ASC) VISIBLE)
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `deliverys` (
  `_id` BIGINT NOT NULL AUTO_INCREMENT,
  `traking_no` VARCHAR(100) NOT NULL,
  `market_place` VARCHAR(100) NOT NULL,
  `serller_name` VARCHAR(100) NULL,
  `seller_number` VARCHAR(100) NULL,
  `address` VARCHAR(100) NULL,
  `receiver_name` VARCHAR(100) NULL,
  `receiver_eng_name` VARCHAR(100) NULL,
  `receiver_gata_name` VARCHAR(100) NULL,
  `receiver_tel` VARCHAR(100) NULL,
  `receiver_phone` VARCHAR(100) NULL,
  `receiver_address` VARCHAR(200) NULL,
  `receiver_zipcode` VARCHAR(100) NULL,
  `company` VARCHAR(100) NULL,
  `type` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `nation_code` VARCHAR(100) NULL,
  `memo` MEDIUMTEXT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `order_details` (
  `_id` BIGINT NOT NULL AUTO_INCREMENT,
  `items_id` BIGINT NOT NULL,
  `order_no` VARCHAR(100) NOT NULL,
  `deliverys_id` BIGINT NOT NULL,
  `count` BIGINT NOT NULL,
  `price` BIGINT NOT NULL,
  `discount_price` BIGINT NOT NULL,
  `payment_price` BIGINT NOT NULL,
  `delivery_price` BIGINT NOT NULL,
  `price_unit` VARCHAR(100) NOT NULL,
  `option` MEDIUMTEXT NULL,
  `payment_at` DATETIME NULL,
  `shipping_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`_id`),
  INDEX `fk_order_details_orders_idx` (`order_no` ASC) VISIBLE,
  INDEX `fk_order_details_deliverys1_idx` (`deliverys_id` ASC) VISIBLE,
  INDEX `fk_order_details_items1_idx` (`items_id` ASC) VISIBLE)
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `emails` (
  `_id` BIGINT NOT NULL auto_increment ,
  `email` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(100) NOT NULL,
  `status` VARCHAR(100),
  `retry_count` INTEGER DEFAULT 0,
  `sended_at` DATETIME,
  `create_at` DATETIME,
  `update_at` DATETIME,
  `deleted_at` DATETIME,
  PRIMARY KEY (`_id`))
ENGINE=InnoDB DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `exchange` (
  `_id` BIGINT NOT NULL AUTO_INCREMENT,
  `currency_code` VARCHAR(100) NULL COMMENT '통화 코드',
  `nation_name` VARCHAR(100) NULL COMMENT '국가/통화명',
  `receive_rate` DECIMAL(10, 3) NULL COMMENT '전신환(송금) 받을때',
  `sand_rate` DECIMAL(10, 3) NULL COMMENT '전신환(송금) 보내실때',
  `sale_standard_rate` DECIMAL(10, 3) NULL COMMENT '매매 기준율',
  `book_value` DECIMAL(10, 3) NULL COMMENT '장부 가격',
  `year_transit_interest_rate` DECIMAL(10, 3) NULL COMMENT '연환가료율',
  `ten_day_transit_interest_rate` DECIMAL(10, 3) NULL COMMENT '10일 환가료율',
  `korea_trading_standard_rate` DECIMAL(10, 3) NULL COMMENT '서울외국환중개매매기준율',
  `korea_book_value` DECIMAL(10, 3) NULL COMMENT '서울외국환중개장부가격',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB DEFAULT CHARACTER SET utf8;
```
