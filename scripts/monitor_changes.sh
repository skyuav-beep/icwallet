#!/usr/bin/env bash
set -euo pipefail

# EN: Monitor filesystem changes across key project directories and log events.
# KR: 주요 프로젝트 디렉터리의 파일 시스템 변화를 감시하고 이벤트를 기록합니다.

usage() {
  cat <<'EOF'
EN: Usage: scripts/monitor_changes.sh [PATH...]
    - Monitors modify/create/delete/move events (recursive).
    - Defaults to src backend frontend docs spec.md when no path is supplied.
    - Set LOG_FILE to override the output file (default: ./change-monitor.log).
    - Set EVENTS to override the event list (default: modify,create,delete,move).
    - Set EXCLUDE to pass a regex of paths to ignore (default: node_modules|\.git|dist|\.pnpm).

KR: 사용법: scripts/monitor_changes.sh [경로...]
    - 수정/생성/삭제/이동 이벤트를 재귀적으로 감시합니다.
    - 경로를 지정하지 않으면 src backend frontend docs spec.md 를 기본으로 감시합니다.
    - LOG_FILE 환경 변수를 설정하면 기록 파일(기본값: ./change-monitor.log)을 바꿀 수 있습니다.
    - EVENTS 환경 변수로 감시 이벤트 목록(기본값: modify,create,delete,move)을 변경할 수 있습니다.
    - EXCLUDE 환경 변수는 무시할 경로 정규식을 전달합니다(기본값: node_modules|\.git|dist|\.pnpm).
EOF
}

if [[ "${1:-}" =~ ^(-h|--help)$ ]]; then
  usage
  exit 0
fi

if ! command -v inotifywait >/dev/null 2>&1; then
  echo "EN: error: inotifywait not found; install inotify-tools." >&2
  echo "KR: 오류: inotifywait 명령을 찾을 수 없습니다. inotify-tools를 설치하세요." >&2
  exit 1
fi

LOG_FILE="${LOG_FILE:-./change-monitor.log}"
EVENTS="${EVENTS:-modify,create,delete,move}"
EXCLUDE="${EXCLUDE:-node_modules|\.git|dist|\.pnpm}"

declare -a TARGETS=("$@")
if [[ ${#TARGETS[@]} -eq 0 ]]; then
  TARGETS=(src backend frontend docs spec.md)
fi

declare -a WATCH_LIST=()
for path in "${TARGETS[@]}"; do
  if [[ -e "$path" ]]; then
    WATCH_LIST+=("$path")
  else
    echo "EN: warn: skipping '$path' (not found)." >&2
    echo "KR: 경고: '$path' 경로가 없어 감시 대상에서 제외합니다." >&2
  fi
done

if [[ ${#WATCH_LIST[@]} -eq 0 ]]; then
  echo "EN: error: no valid watch targets resolved." >&2
  echo "KR: 오류: 유효한 감시 대상이 없습니다." >&2
  exit 1
fi

touch "$LOG_FILE"
echo "EN: logging to $LOG_FILE" >&2
echo "KR: 로그 기록 위치: $LOG_FILE" >&2

# EN: Run inotifywait in monitor mode, append timestamped events to the log.
# KR: inotifywait를 모니터 모드로 실행하여 타임스탬프가 포함된 이벤트를 로그에 추가합니다.
exec inotifywait \
  -m \
  -r \
  --timefmt '%F %T' \
  --format '%T %w%f %e' \
  --event "$EVENTS" \
  --exclude "$EXCLUDE" \
  "${WATCH_LIST[@]}" >>"$LOG_FILE"
