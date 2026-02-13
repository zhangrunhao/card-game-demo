# track统一描述

## 基本参数类型

- time: 时间戳
- project: 项目id (hub, cardgame)
- device_id: 设备id
- event: 事件名称
- params: 参数

## hub项目埋点定义

- event: "load_page" (页面访问)
  - params: {page_name: "home"}
  - page_name包括: home
- event: "click" (按钮点击)
  - params: {button: "nav_product"}
  - button包括: nav_product, nav_ideas, nav_reviews, nav_about, main_view_products, main_view_reviews

## cardgame埋点定义

- event:
