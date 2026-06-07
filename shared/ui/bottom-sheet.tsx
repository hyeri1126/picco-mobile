import { Modal, Pressable, View } from 'react-native';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// 웹 고정 오버레이를 RN Modal로 이식. @gorhom/bottom-sheet 미설치라 Modal 슬라이드로 처리.
export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />
        <View className="max-h-[88%] overflow-hidden rounded-t-3xl bg-white">
          {children}
        </View>
      </View>
    </Modal>
  );
}
