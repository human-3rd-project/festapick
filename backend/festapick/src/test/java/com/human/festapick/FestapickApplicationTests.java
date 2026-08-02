package com.human.festapick;

import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.entity.Users;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.AdminService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FestapickApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private FirebaseApp firebaseApp;

	@MockitoBean
	private Bucket firebaseStorageBucket;

	@MockitoBean
	private AdminService adminService;

	@Test
	void contextLoads() {
	}

	@Test
	void calendarJsonIsPublicForAnonymousUser() throws Exception {
		mockMvc.perform(get("/calendar")
						.accept("application/json"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.content").isArray());
	}

	@Test
	void calendarFavoriteOnlyIsPublicAndEmptyForAnonymousUser() throws Exception {
		mockMvc.perform(get("/calendar")
						.param("favoriteOnly", "true")
						.accept("application/json"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.totalElements").value(0));
	}

	@Test
	void calendarFavoritesRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/calendar/favorites")
						.accept("application/json"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void adminScreenRoutesForwardToReact() throws Exception {
		mockMvc.perform(get("/admin/members")
						.accept("text/html"))
				.andExpect(status().isOk())
				.andExpect(forwardedUrl("/index.html"));
	}

	@Test
	void legacyFestivalScreenRouteForwardsToReact() throws Exception {
		mockMvc.perform(get("/festivals/1")
						.accept("text/html"))
				.andExpect(status().isOk())
				.andExpect(forwardedUrl("/index.html"));
	}

	@Test
	void festivalDetailJsonRouteStaysApiRoute() throws Exception {
		mockMvc.perform(get("/festivals/999999999999")
						.accept("application/json"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void reactScreenRoutesForwardToReactOnRefresh() throws Exception {
		List<String> routes = List.of(
				"/search",
				"/nearby",
				"/calendar",
				"/ai",
				"/ai-recommend",
				"/detail/1",
				"/festivals/1",
				"/donation",
				"/donation/success",
				"/donation/fail",
				"/mypage",
				"/mypage/profile",
				"/mypage/region",
				"/mypage/favorite",
				"/mypage/record",
				"/mypage/review",
				"/mypage/account",
				"/mypage/password/verify",
				"/mypage/password/reset",
				"/admin",
				"/admin/members",
				"/admin/reviews",
				"/admin/festivals",
				"/admin/donations",
				"/login",
				"/signup",
				"/find-id",
				"/find-password",
				"/reset-password",
				"/social-login",
				"/oauth/kakao/callback"
		);

		for (String route : routes) {
			mockMvc.perform(get(route)
							.accept("text/html"))
					.andExpect(status().isOk())
					.andExpect(forwardedUrl("/index.html"));
		}
	}

	@Test
	void adminSearchRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/admin/users/search")
						.accept("application/json"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void adminSearchRejectsNormalUserAtSecurityLayer() throws Exception {
		mockMvc.perform(get("/admin/users/search")
						.with(user("member").roles("USER"))
						.accept("application/json"))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminSearchAllowsAdminUser() throws Exception {
		when(adminService.searchUsers(ArgumentMatchers.<String>isNull(), any()))
				.thenReturn(Page.empty());

		mockMvc.perform(get("/admin/users/search")
						.with(authentication(adminAuthentication()))
						.accept("application/json"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));
	}

	private UsernamePasswordAuthenticationToken adminAuthentication() {
		Users admin = Users.builder()
				.userId(1L)
				.loginId("admin")
				.email("admin@example.com")
				.nickname("admin")
				.password("password")
				.role(UserRole.ADMIN)
				.provider(OAuthProvider.LOCAL)
				.status(UserStatus.ACTIVE)
				.build();
		List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
		CustomUserDetail principal = new CustomUserDetail(admin, authorities);

		return new UsernamePasswordAuthenticationToken(principal, null, authorities);
	}

}
