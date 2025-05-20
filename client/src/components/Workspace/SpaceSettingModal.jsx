// components/workspace/SpaceSettingModal.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {Settings} from 'lucide-react';

const SpaceSettingModal = ({
  isOpen,
  onClose,
  editorTheme,
  setEditorTheme,
  editorFontSize,
  setEditorFontSize,
  minimapEnabled,
  setMinimapEnabled,
  wordWrap,
  setWordWrap,
  lineNumbers,
  setLineNumbers,
  tabSize,
  setTabSize,
}) => {
  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
  ];

  const fontSizes = [12, 14, 16, 18];

  const wordWrapOptions = [
    { value: 'off', label: 'Off' },
    { value: 'on', label: 'On' },
    { value: 'wordWrapColumn', label: 'Column' },
    { value: 'bounded', label: 'Bounded' },
  ];

  const lineNumbersOptions = [
    { value: 'on', label: 'On' },
    { value: 'off', label: 'Off' },
    { value: 'relative', label: 'Relative' },
  ];

  const tabSizes = [2, 4, 8];

  const [tempTheme, setTempTheme] = React.useState(editorTheme);
  const [tempFontSize, setTempFontSize] = React.useState(editorFontSize);
  const [tempMinimapEnabled, setTempMinimapEnabled] = React.useState(minimapEnabled);
  const [tempWordWrap, setTempWordWrap] = React.useState(wordWrap);
  const [tempLineNumbers, setTempLineNumbers] = React.useState(lineNumbers);
  const [tempTabSize, setTempTabSize] = React.useState(tabSize);

  const handleSave = () => {
    setEditorTheme(tempTheme);
    setEditorFontSize(tempFontSize);
    setMinimapEnabled(tempMinimapEnabled);
    setWordWrap(tempWordWrap);
    setLineNumbers(tempLineNumbers);
    setTabSize(tempTabSize);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-[#ffffff] border-[#333333] rounded-lg max-w-lg p-4">
        <DialogHeader className="mb-2">
          <DialogTitle className=" font-medium text-[#ffffff]" > <Settings className="w-5 h-5 diaplay inline mr-2  text-[#f5b210]" />Editor Settings</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="theme" className="text-xs font-medium text-[#ffffff] mb-1 block">
                Theme
              </Label>
              <Select value={tempTheme} onValueChange={setTempTheme}>
                <SelectTrigger
                  id="theme"
                  className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] h-8 text-xs"
                >
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333]">
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value} className="text-xs">
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="font-size" className="text-xs font-medium text-[#ffffff] mb-1 block">
                Font Size
              </Label>
              <Select
                value={tempFontSize.toString()}
                onValueChange={(value) => setTempFontSize(Number(value))}
              >
                <SelectTrigger
                  id="font-size"
                  className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] h-8 text-xs"
                >
                  <SelectValue placeholder="Select Font Size" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333]">
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="minimap"
                checked={tempMinimapEnabled}
                onCheckedChange={setTempMinimapEnabled}
                className="border-[#333333] data-[state=checked]:bg-[#f5b210] data-[state=checked]:text-[#1A1A1A]"
              />
              <Label htmlFor="minimap" className="text-xs font-medium text-[#ffffff]">
                Enable Minimap
              </Label>
            </div>
            <div>
              <Label htmlFor="word-wrap" className="text-xs font-medium text-[#ffffff] mb-1 block">
                Word Wrap
              </Label>
              <Select value={tempWordWrap} onValueChange={setTempWordWrap}>
                <SelectTrigger
                  id="word-wrap"
                  className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] h-8 text-xs"
                >
                  <SelectValue placeholder="Select Word Wrap" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333]">
                  {wordWrapOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="line-numbers" className="text-xs font-medium text-[#ffffff] mb-1 block">
                Line Numbers
              </Label>
              <Select value={tempLineNumbers} onValueChange={setTempLineNumbers}>
                <SelectTrigger
                  id="line-numbers"
                  className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] h-8 text-xs"
                >
                  <SelectValue placeholder="Select Line Numbers" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333]">
                  {lineNumbersOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tab-size" className="text-xs font-medium text-[#ffffff] mb-1 block">
                Tab Size
              </Label>
              <Select
                value={tempTabSize.toString()}
                onValueChange={(value) => setTempTabSize(Number(value))}
              >
                <SelectTrigger
                  id="tab-size"
                  className="bg-[#2A2A2A] text-[#ffffff] border-[#333333] h-8 text-xs"
                >
                  <SelectValue placeholder="Select Tab Size" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] text-[#ffffff] border-[#333333]">
                  {tabSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-[#ffffff] border-[#333333] hover:bg-[#333333] text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#f5b210] text-[#1A1A1A] hover:bg-[#f5b210]/80 text-xs h-8"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpaceSettingModal;