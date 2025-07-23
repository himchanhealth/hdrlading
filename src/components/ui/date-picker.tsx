"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "날짜를 선택하세요",
  className,
  disabled,
  minDate,
  maxDate
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  // Update input value when date changes
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
    } else {
      setInputValue("")
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Try to parse the input as a date
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        // Check if date is within bounds
        const isValid = (!minDate || parsedDate >= minDate) && 
                       (!maxDate || parsedDate <= maxDate)
        if (isValid) {
          onDateChange?.(parsedDate)
        }
      }
    } else {
      onDateChange?.(undefined)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setIsPopoverOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <div className="relative">
          <Input
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
            disabled={disabled}
            min={minDate ? format(minDate, "yyyy-MM-dd") : undefined}
            max={maxDate ? format(maxDate, "yyyy-MM-dd") : undefined}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              disabled={disabled}
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">캘린더 열기</span>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}