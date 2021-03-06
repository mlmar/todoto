import React from 'react';
import Time from '../clock/Time.js';
import Clock from '../clock/Clock.js';
import List from '../generic/List.js';
import Reminder from './Reminder.js';

class Today extends React.Component {
  constructor(props) {
    super(props);
    
    this.time = new Time();

    this.currentTime = "";
    this.times = [];
    
    this.today = React.createRef();
    this.switch = this.switch.bind(this);

    this.handleItemRender = this.handleItemRender.bind(this);
    this.compareTimes = this.compareTimes.bind(this);
    this.createNotification = this.createNotification.bind(this);
  }

  switch() {
    this.today.current.classList.toggle("hide");
  }

  /*  callback : return item to be rendered in a List component
   *    @ from list component
   */
  handleItemRender(reminder, i) {
    var temp = 
      <Reminder
        id={reminder.id}
        date={reminder.date}
        title={reminder.title}
        text={reminder.text}
        key={i}
        onClick=""
        hideDate="true"
      />
    return temp;
  }

  // determine if current time is in the current stack of times
  //  if it is, notify the user and filter it out
  compareTimes(time, date) {
    var shortened = time.split(":");
    shortened = shortened[0] + ":" + shortened[1];

    var mobile = window.matchMedia("only screen and (max-width: 768px)").matches;
    if(!mobile && this.times.includes(shortened)) {
      for(var i = 0; i < this.props.reminders.length; i++) {
        if(this.props.reminders[i].time === shortened) {
          this.createNotification(shortened + " " + this.props.reminders[i].title, this.props.reminders[i].text);
        }
      }
      
      this.times = this.times.filter((time) => time !== shortened);
    }
  }

  // chrome notifications
  createNotification(title, text) {
    if(Notification.permission === "granted") {
      var notification = new Notification(title, {
        icon: "",
        body: text,
      });
      console.log(notification);
    }
  }

  render() {
    var today = new Date().toLocaleDateString();
    
    // prop arrays ar still affected .push, .slice, .sort, etc. so make a copy
    var reminders = [...this.props.reminders];
    reminders = reminders.filter((item) => new Date(item.date).toLocaleDateString() === today);
    var sortedReminders = reminders.sort((a, b) => { return a.date.localeCompare(b.date) })
    
    // store only times in a stack for notifications
    var temp = []
    reminders.filter(reminder => temp.push(reminder.time));
    this.times = temp;

    return (
      <div className="today" ref={this.today}>
        <span>
          <span className="label-and-button">
            <button className="force-button landscape" onClick={this.props.handleScreen}> &#8609; </button>
            <Clock date="true" clockStyle="label-large label-bolder"/>
          </span>
          <Clock getTime={(time, date) => this.compareTimes(time, date)}clockStyle="clock"/>
        </span>
        <List items={sortedReminders} render={this.handleItemRender}/>
      </div>
    )
  }
}

export default Today;