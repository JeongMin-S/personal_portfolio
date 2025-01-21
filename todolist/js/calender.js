document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("'calendar' 요소를 찾을 수 없습니다! HTML에서 id를 확인하세요.");
    return;
  }

  // 로컬스토리지 값 가져오기
  let toDos = JSON.parse(localStorage.getItem("toDos")) || [];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    //라이브러리 값 설정
    initialView: "dayGridMonth",
    selectable: true, // 날짜 선택 가능
    locale: "ko", // 한국어 설정
    timeZone: "Asia/Seoul", // 한국 시간으로 설정

    // 날짜별 할 일 개수 표시
    events: Object.values(
      toDos.reduce((acc, todo) => {
        if (!todo.checked) {
          // 체크되지 않은 할 일만 카운트
          acc[todo.date] = acc[todo.date] || { count: 0, date: todo.date };
          acc[todo.date].count++;
        }
        return acc;
      }, {})
    ).map((item) => ({
      title: `${item.count}`,
      start: item.date,
      allDay: true,
    })),

    //날짜 선택
    dateClick: function (info) {
      const selectedDate = info.dateStr;
      // 특정 날짜의 투두리스트를 필터링하여 보여주기
      showToDoListByDate(selectedDate);
      updateSelectedDate(selectedDate); // 선택한 날짜 업데이트
    },
  });

  calendar.render();
  console.log("✅ FullCalendar 렌더링 완료!");

  // 초기 로딩 시 오늘 날짜의 투두리스트 표시
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
  /**
   * let now = new Date();
  let year = now.getFullYear();
  let month = String(now.getMonth() + 1).padStart(2, "0");
  let day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`; 
  */
  showToDoListByDate(today);
});

function showToDoListByDate(selectedDate) {
  let toDos = JSON.parse(localStorage.getItem("toDos")) || [];

  if (!Array.isArray(toDos)) {
    console.error("🚨 'toDos' 배열이 존재하지 않습니다!");
    return;
  }

  const filteredToDos = toDos.filter((todo) => todo.date === selectedDate);
  const toDoListScreen__list = document.querySelector(".toDoListScreen__list");

  if (!toDoListScreen__list) {
    console.error("🚨 'toDoListScreen__list' 요소를 찾을 수 없습니다!");
    return;
  }

  toDoListScreen__list.innerHTML = ""; // 기존 리스트 초기화
  filteredToDos.forEach((todo) => {
    showToDoList(todo); // 기존의 showToDoList 함수 활용
  });
}

function updateCalendarEvents() {
  let toDos = JSON.parse(localStorage.getItem("toDos")) || [];
  const calendar = FullCalendar.getCalendar("calendar"); // FullCalendar 인스턴스 가져오기

  if (calendar) {
    calendar.removeAllEvents(); // 기존 이벤트 제거
    calendar.addEventSource(
      Object.values(
        toDos.reduce((acc, todo) => {
          if (!todo.checked) {
            // 🔹 완료되지 않은 투두리스트만 카운트
            acc[todo.date] = acc[todo.date] || { count: 0, date: todo.date };
            acc[todo.date].count++;
          }
          return acc;
        }, {})
      ).map((item) => ({
        title: `${item.count}`, // 해당 날짜의 미완료 투두 개수 표시
        start: item.date,
        allDay: true,
      }))
    );
  }
}
