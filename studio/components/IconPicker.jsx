import React, {useState, useCallback} from 'react'
import {Stack, TextInput, Card, Grid, Box, Text, Button} from '@sanity/ui'
import {set, unset} from 'sanity'

const COMMON_ICONS = [
  {icon: '🏠', label: 'Home'},
  {icon: '📝', label: 'Document'},
  {icon: '⚖️', label: 'Legal'},
  {icon: '🛡️', label: 'Protection'},
  {icon: '💼', label: 'Business'},
  {icon: '📱', label: 'Mobile'},
  {icon: '📈', label: 'Growth'},
  {icon: '💰', label: 'Money'},
  {icon: '🤝', label: 'Partnership'},
  {icon: '🔍', label: 'Search'},
  {icon: '⚡', label: 'Fast'},
  {icon: '🔒', label: 'Security'},
  {icon: '✅', label: 'Checkmark'},
  {icon: '🌟', label: 'Star'},
  {icon: '📊', label: 'Chart'},
  {icon: '📧', label: 'Email'},
  {icon: '🏆', label: 'Trophy'},
  {icon: '👨‍⚖️', label: 'Judge'},
  {icon: '👩‍⚖️', label: 'Judge'},
  {icon: '🚗', label: 'Car'},
  {icon: '🏡', label: 'House'},
  {icon: '👪', label: 'Family'},
  {icon: '👥', label: 'People'},
  {icon: '🏢', label: 'Building'}
]

const IconPicker = (props) => {
  const {value, onChange} = props
  const [customIcon, setCustomIcon] = useState('')

  const handleSelectIcon = useCallback(
    (icon) => {
      onChange(set(icon))
    },
    [onChange]
  )

  const handleCustomIconChange = useCallback(
    (event) => {
      setCustomIcon(event.currentTarget.value)
    },
    [setCustomIcon]
  )

  const handleSetCustomIcon = useCallback(
    () => {
      if (customIcon) {
        onChange(set(customIcon))
        setCustomIcon('')
      }
    },
    [customIcon, onChange]
  )

  const handleClear = useCallback(
    () => {
      onChange(unset())
    },
    [onChange]
  )

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Text weight="semibold">Selected Icon: {value || 'None'}</Text>
          
          <Button 
            mode="ghost" 
            text="Clear" 
            disabled={!value} 
            onClick={handleClear} 
          />
        </Stack>
      </Card>
      
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Text weight="semibold">Custom Icon</Text>
          <Stack space={3} direction="row">
            <Box flex={1}>
              <TextInput 
                value={customIcon}
                onChange={handleCustomIconChange}
                placeholder="Enter custom emoji or character"
              />
            </Box>
            <Button 
              text="Add" 
              onClick={handleSetCustomIcon}
              disabled={!customIcon}
              tone="primary"
            />
          </Stack>
        </Stack>
      </Card>

      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Text weight="semibold">Common Icons</Text>
          <Grid columns={[2, 3, 4, 6]} gap={2}>
            {COMMON_ICONS.map((item) => (
              <Card
                key={item.icon}
                padding={3}
                radius={2}
                shadow={1}
                tone={value === item.icon ? 'primary' : 'default'}
                onClick={() => handleSelectIcon(item.icon)}
                style={{cursor: 'pointer', textAlign: 'center'}}
              >
                <Stack space={2} style={{alignItems: 'center'}}>
                  <Text size={4}>{item.icon}</Text>
                  <Text size={1}>{item.label}</Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  )
}

export default IconPicker 