package com.human.festapick.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WebController implements ErrorController {

    @RequestMapping(value = "/error")
    public ModelAndView handleError() {
        // React 빌드 결과물의 index.html로 포워딩
        return new ModelAndView("forward:/");
    }
}