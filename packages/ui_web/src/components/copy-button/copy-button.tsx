'use client';

import { useEffect, useRef, useState } from 'react';
import { TRButton, type TRButtonProps } from '../button/index.js';

export type TRCopyButtonStatus = 'idle' | 'copied' | 'unavailable';
export type TRCopyButtonProps = Omit<TRButtonProps, 'children'> & {
  copiedLabel?: string;
  idleLabel?: string;
  onStatusChange?: (status: TRCopyButtonStatus) => void;
  resetDelay?: number;
  unavailableLabel?: string;
  value: string;
};

const clipboardTimeout = 1_000;
type CopyButtonClickEvent = Parameters<NonNullable<TRButtonProps['onClick']>>[0];

function writeWithSelection(value: string) {
  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index),
      )
    : [];
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  try {
    return typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (activeElement?.isConnected) activeElement.focus({ preventScroll: true });
    selection?.removeAllRanges();
    for (const range of ranges) selection?.addRange(range);
  }
}

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    let timeoutId!: ReturnType<typeof setTimeout>;
    try {
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error('Clipboard timed out')),
          clipboardTimeout,
        );
      });
      await Promise.race([navigator.clipboard.writeText(value), timeout]);
      return true;
    } catch {
      // The selection fallback covers denied, rejected, and timed-out Clipboard API calls.
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return writeWithSelection(value);
}

export function TRCopyButton({
  copiedLabel = 'Copied',
  idleLabel = 'Copy',
  onClick,
  onStatusChange,
  resetDelay = 2_000,
  unavailableLabel = 'Copy unavailable',
  value,
  ...props
}: TRCopyButtonProps) {
  const [status, setStatus] = useState<TRCopyButtonStatus>('idle');
  const copyAttemptRef = useRef(0);
  const mountedRef = useRef(true);
  const onStatusChangeRef = useRef(onStatusChange);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      copyAttemptRef.current += 1;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function updateStatus(nextStatus: TRCopyButtonStatus, copyAttempt: number) {
    if (!mountedRef.current || copyAttempt !== copyAttemptRef.current) return;
    setStatus(nextStatus);
    onStatusChangeRef.current?.(nextStatus);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      if (!mountedRef.current || copyAttempt !== copyAttemptRef.current) return;
      setStatus('idle');
      onStatusChangeRef.current?.('idle');
    }, resetDelay);
  }

  async function handleClick(event: CopyButtonClickEvent) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const copyAttempt = copyAttemptRef.current + 1;
    copyAttemptRef.current = copyAttempt;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    updateStatus((await writeClipboard(value)) ? 'copied' : 'unavailable', copyAttempt);
  }

  const label =
    status === 'copied'
      ? copiedLabel
      : status === 'unavailable'
        ? unavailableLabel
        : idleLabel;

  return (
    <TRButton {...props} data-copy-status={status} onClick={handleClick}>
      <span className="tr-copy-button-label-stack">
        <span
          aria-hidden={status === 'idle' ? undefined : true}
          data-copy-label="idle"
          data-copy-label-active={status === 'idle' ? 'true' : undefined}
        >
          {idleLabel}
        </span>
        <span
          aria-hidden="true"
          data-copy-label="copied"
          data-copy-label-active={status === 'copied' ? 'true' : undefined}
        >
          {copiedLabel}
        </span>
        <span
          aria-hidden="true"
          data-copy-label="unavailable"
          data-copy-label-active={status === 'unavailable' ? 'true' : undefined}
        >
          {unavailableLabel}
        </span>
      </span>
      <span aria-live="polite" className="tr-copy-button-announcement">
        {status === 'idle' ? '' : label}
      </span>
    </TRButton>
  );
}
