import { useState } from 'react';

const NotFound = () => {
  const randomEmoji = () => {
    const emojis = ['😄', '😃', '😀', '😊', '☺', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑'];
    return emojis[(Math.floor(Math.random() * emojis.length))];
  };
  const [emoji, setEmoji] = useState(randomEmoji);
  const [emojiAngle, setEmojiAngle] = useState(0);

  return (
    <div
      style={{ fontSize: '36px' }}
    >
      <div>404&nbsp;
        <div
          style={{
            display: 'inline-block',
            width: 'fit-content',
            rotate: `${emojiAngle}deg`,
          }}
          onClick={e => setEmoji(randomEmoji)}
          onWheel={e => setEmojiAngle((emojiAngle + Math.sign(e.deltaY) * 17 + 360) % 360)}
        >
          {emoji}
        </div>
      </div>
      <div>
        Sivua ei löydy
      </div>
    </div>
  );
};

export default NotFound;
