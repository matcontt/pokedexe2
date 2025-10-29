import { View, TextInput, TextInputProps } from 'react-native';
import { Search } from 'lucide-react-native';

interface TextFieldProps extends TextInputProps {
  icon?: boolean;
}

export default function TextField({ icon = false, ...props }: TextFieldProps) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
      {icon && <Search size={20} color="#6b7280" className="mr-2" />}
      <TextInput
        {...props}
        className="flex-1 text-base"
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}