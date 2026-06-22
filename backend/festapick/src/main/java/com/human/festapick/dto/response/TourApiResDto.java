package com.human.festapick.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourApiResDto {

    // TourAPI 최상위 응답 객체입니다. 실제 축제 목록은 response.body.items.item 안에 들어 있습니다.
    private Response response;

    // Controller/Service에서 null 체크를 반복하지 않도록 축제 목록만 안전하게 꺼내는 편의 메서드입니다.
    public List<TourFestivalItemDto> getFestivalItems() {
        return Optional.ofNullable(response)
                .map(Response::getBody)
                .map(Body::getItems)
                .map(Items::getItem)
                .orElse(Collections.emptyList());
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {

        // resultCode/resultMsg가 들어있는 응답 상태 정보입니다.
        private Header header;

        // 페이징 정보와 실제 item 목록이 들어있는 응답 본문입니다.
        private Body body;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Header {

        // TourAPI 처리 결과 코드입니다. 보통 정상은 "0000"입니다.
        private String resultCode;

        // TourAPI 처리 결과 메시지입니다.
        private String resultMsg;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {

        // 검색 결과 목록을 감싸는 객체입니다.
        @JsonDeserialize(using = EmptyStringItemsDeserializer.class)
        private Items items;

        // 한 페이지에 조회된 데이터 개수입니다.
        private Integer numOfRows;

        // 현재 페이지 번호입니다.
        private Integer pageNo;

        // 전체 검색 결과 개수입니다.
        private Integer totalCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Items {

        // 실제 축제 목록입니다. TourAPI에서 단건/다건 응답이 모두 이 필드로 매핑됩니다.
        @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
        @JsonProperty("item")
        private List<TourFestivalItemDto> item;
    }

    public static class EmptyStringItemsDeserializer extends JsonDeserializer<Items> {

        @Override
        public Items deserialize(JsonParser parser, DeserializationContext context) throws IOException {
            JsonToken token = parser.currentToken();
            if (token == JsonToken.VALUE_STRING && parser.getValueAsString().isBlank()) {
                return emptyItems();
            }
            if (token == JsonToken.VALUE_NULL) {
                return emptyItems();
            }

            JsonNode itemsNode = parser.getCodec().readTree(parser);
            if (itemsNode == null || itemsNode.isNull()) {
                return emptyItems();
            }

            JsonNode itemNode = itemsNode.get("item");
            if (itemNode == null || itemNode.isNull()) {
                return emptyItems();
            }

            Items items = new Items();
            if (itemNode.isArray()) {
                List<TourFestivalItemDto> festivalItems = new ArrayList<>();
                for (JsonNode node : itemNode) {
                    festivalItems.add(parser.getCodec().treeToValue(node, TourFestivalItemDto.class));
                }
                items.setItem(festivalItems);
                return items;
            }

            if (itemNode.isObject()) {
                items.setItem(List.of(parser.getCodec().treeToValue(itemNode, TourFestivalItemDto.class)));
                return items;
            }

            return emptyItems();
        }

        private Items emptyItems() {
            Items items = new Items();
            items.setItem(Collections.emptyList());
            return items;
        }
    }
}
