package com.human.festapick.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WebController implements ErrorController {

    @GetMapping({
            "/search", "/nearby", "/festival-calendar", "/ai", "/ai-recommend",
            "/detail/{festivalId}",
            "/donation", "/donation/success", "/donation/fail",
            "/login", "/signup", "/find-id", "/find-password", "/reset-password", "/social-login",
            "/mypage", "/mypage/**",
            "/admin", "/admin/members", "/admin/reviews", "/admin/festivals", "/admin/donations",
            "/oauth/kakao/callback"
    })
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }

    @RequestMapping("/error")
    public ModelAndView handleError() {
        return new ModelAndView("forward:/");
    }
}
