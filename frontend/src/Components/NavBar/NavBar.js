import React,{useState} from 'react';
import { connect } from 'react-redux';
import { store } from '../../store';
import { useHistory } from 'react-router-dom';
import { Input,Avatar} from 'antd';
import {Icon} from 'semantic-ui-react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { update_isLoggedIn, update_Username } from '../../redux/actions/actions';
import Login from '../Modals/Login/Login';
import def_Avatar from '../../images/avatar.png';
const drawerWidth = 240;

let logged;
const { Search } = Input;

function mapStateToProps(state) {
  return {
    Username: state.Username,
    isLoggedIn: state.isLoggedIn,
    Avatar:state.Avatar,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const NavBar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [text,settext] = useState("")
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false);
  const avatar = props.Avatar
  let history = useHistory()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function onShow() {
    setShow(true)
    handleDrawerClose()
  }

  function onHide() {
    setShow(false)
  }

  function onSearch() {
    if (text.trim()) {
      history.push('/' + text + '/Stats/page=1')
    }
  }

  function LogOut() {
    store.dispatch(update_isLoggedIn(false))
    store.dispatch(update_Username(""))
    handleDrawerClose()
  }

  if (!props.isLoggedIn) {
    logged = 
    <ListItem button onClick = { onShow } >
      <Avatar src={def_Avatar}/>
      <ListItemText style={{color: 'blue',marginLeft: "20px"}}>
        Log In
      </ListItemText>
    </ListItem>
  } else {
    logged = 
    <ListItem button onClick = { LogOut } >
      <Avatar src={avatar ? avatar: def_Avatar}/>
      <ListItemText style={{color: 'blue',marginLeft: "20px"}} >
        Log Out
      </ListItemText>
    </ListItem>  
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div style={{width:"100%"}}>
          < Search style={{maxWidth:"300px",float:"right"}} onSearch={onSearch} onChange={(e) =>settext(e.target.value)} value={text} placeholder = "Search User.."/>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem key={1} button onClick={() => {
            history.push('/Play')
            handleDrawerClose()}} >
            <Icon name='chess' size='big'/>
            <ListItemText style={{color: 'blue',marginLeft: "20px"}} >
              Play
            </ListItemText>
            </ListItem>  
          <ListItem key={2} button onClick={() => {
            history.push('/Stats/page=1')
            handleDrawerClose()}} >
            <Icon name='pie graph' size='big' />
            <ListItemText style={{color: 'blue',marginLeft: "20px"}} >
              Stats
            </ListItemText>
          </ListItem>
          <ListItem key={3} button onClick={() => {
            history.push('/Forum/page=1')
            handleDrawerClose()}} >
            <Icon name='file text' size='big' />
            <ListItemText style={{color: 'blue',marginLeft: "20px"}} >
              Forum
            </ListItemText>
          </ListItem>   
          <ListItem key={4}>
            {logged}
          </ListItem>
        </List>
        
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
      <div className={classes.drawerHeader} />
      </main>
      <li><Login show = { show } onHide = { onHide }/></li>
    </div>
  );
}
export default connect(mapStateToProps)(NavBar);