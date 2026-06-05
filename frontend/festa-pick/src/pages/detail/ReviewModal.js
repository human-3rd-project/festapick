import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

import {
  ActionButton,
  Backdrop,
  CharacterCount,
  CloseButton,
  Content,
  FestivalCard,
  FestivalImage,
  Footer,
  Header,
  ModalPanel,
  RatingSection,
  StarButton,
  Textarea,
  TextareaGroup,
  Title,
} from "./ReviewModalCss";

const MAX_REVIEW_LENGTH = 500;

function ReviewModal({
  isOpen = false,
  festival,
  review,
  onClose,
  onSubmit,
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const isEditMode = Boolean(review);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRating(review?.rating || 5);
    setText(review?.text || "");
  }, [isOpen, review]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      ...review,
      rating,
      text: text.trim(),
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel
        aria-label={isEditMode ? "관람평 수정 모달" : "관람평 작성 모달"}
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <Content onSubmit={handleSubmit}>
          <Header>
            <div>
              <Title>{isEditMode ? "관람평 수정" : "관람평 작성"}</Title>
              <p>소중한 경험을 공유해 주세요.</p>
            </div>
            <CloseButton aria-label="관람평 모달 닫기" onClick={onClose} type="button">
              <X size={28} />
            </CloseButton>
          </Header>

          <FestivalCard>
            <FestivalImage alt="" src={festival?.image} />
            <div>
              <strong>{festival?.title || "축제"}</strong>
              <span>{festival?.period}</span>
            </div>
          </FestivalCard>

          <RatingSection>
            <div>
              {[1, 2, 3, 4, 5].map((value) => (
                <StarButton
                  $active={value <= rating}
                  aria-label={`${value}점`}
                  key={value}
                  onClick={() => setRating(value)}
                  type="button"
                >
                  <Star fill="currentColor" size={40} strokeWidth={1.6} />
                </StarButton>
              ))}
            </div>
            <p>
              <strong>{rating.toFixed(1)}</strong>
              <span>/ 5.0</span>
            </p>
          </RatingSection>

          <TextareaGroup>
            <label htmlFor="review-text">상세 후기</label>
            <Textarea
              id="review-text"
              maxLength={MAX_REVIEW_LENGTH}
              onChange={(event) => setText(event.target.value)}
              placeholder="축제는 어떠셨나요? 생생한 후기를 남겨주세요."
              rows={5}
              value={text}
            />
            <CharacterCount>{text.length} / {MAX_REVIEW_LENGTH}</CharacterCount>
          </TextareaGroup>

          <Footer>
            <ActionButton onClick={onClose} type="button">
              취소
            </ActionButton>
            <ActionButton $primary disabled={!text.trim()} type="submit">
              {isEditMode ? "수정하기" : "등록하기"}
            </ActionButton>
          </Footer>
        </Content>
      </ModalPanel>
    </Backdrop>
  );
}

export default ReviewModal;
