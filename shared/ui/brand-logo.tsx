import Svg, { Circle, Text as SvgText } from 'react-native-svg';

export function BrandLogo({ width = 160 }: { width?: number }) {
  const height = width * 0.4;
  return (
    <Svg width={width} height={height} viewBox="0 0 200 80">
      <SvgText
        x="100"
        y="40"
        fontSize="42"
        fontWeight="900"
        letterSpacing="-1"
        fill="#006A61"
        textAnchor="middle"
        alignmentBaseline="central"
      >
        PICCO
      </SvgText>
      <Circle cx="178" cy="35" r="5" fill="#05B8A9" />
    </Svg>
  );
}
