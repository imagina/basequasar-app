## QSLIDER  | 2.0.3

## Installation

`` npm i @imagina/qslider@2.0.3``

## API Routes

| ENTITY  | ROUTE |
| ------------- | ------------- |
| Sliders | apiRoutes.qslider.sliders |
| Slides | apiRoutes.qslider.slides |
| orderSlides | apiRoutes.qslider.orderSlides |

## Pages

- ### Back-End

  | PAGE | NAME |
  | ------------- | ------------- |
  | Sliders Index | qslider.admin.sliders |
  | Sliders Show | qslider.admin.showSlider |
  | Slides Index | qslider.admin.createSlide |
  | Slides Update | qslider.admin.updateSlide |
 
### Component: carousel
- #### Usage 

    ```js
    import carouselComponent from '@imagina/qslider/_components/carousel';
    
    export default {
      components: {
        carouselComponent
      }
    };
    ```
 
    ```html
    <carousel-component id="[id slider]"></carousel-component>
    ```
