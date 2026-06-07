import { Pressable, type PressableProps, Text } from 'react-native';

const variants = {
  primary: { box: 'bg-primary-container', text: 'text-on-primary' },
  outline: { box: 'border border-primary bg-transparent', text: 'text-primary' },
  ghost: { box: 'bg-transparent', text: 'text-on-surface-variant' },
  kakao: { box: 'bg-[#FEE500]', text: 'text-[#191919]' },
  google: { box: 'border border-outline-variant bg-surface-container-lowest', text: 'text-on-surface' },
} as const;

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const v = variants[variant];
  return (
    <Pressable
      disabled={disabled}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-xl active:opacity-80 ${v.box} ${
        fullWidth ? 'w-full' : 'px-6'
      } ${disabled ? 'opacity-40' : ''} ${className}`}
      {...props}
    >
      <Text className={`typo-label-md ${v.text}`}>{children}</Text>
    </Pressable>
  );
}
