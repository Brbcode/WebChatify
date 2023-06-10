const AvatarUtil = {
  stringToColor: (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  },
  getAvatarProps: ({ displayName, avatar }, style = {}) => {
    const upperDisplayName = displayName.replace(/\s+/g, ' ').toUpperCase();
    const words = upperDisplayName.split(' ');
    const initials = words.map((word) => word[0].toUpperCase()).join('');
    const color = AvatarUtil.stringToColor(displayName);

    const sx = {
      sx: {
        bgcolor: color,
        ...style,
      },
    };

    if (avatar) {
      return {
        ...sx,
        alt: displayName,
        src: avatar,
      };
    }

    return {
      ...sx,
      children: initials,
    };
  },
};

export default AvatarUtil;
