<?php 

	$result = array();
	
	/**
	 * Check for valid request 
	**/
	$request = false;
	if(isset($_POST['do'])){
		switch($_POST['do']){
			case 'add' :
				if(isset($_POST['username']) && isset($_POST['stemail']) && isset($_POST['stname']) && isset($_POST['stcourse']) && isset($_POST['styear']) && isset($_POST['strollno']) && isset($_POST['ststatus']))
					$request = true;
				break;
			case 'edit' :
				if(isset($_POST['stuid']) && isset($_POST['stphone']) && isset($_POST['stcgpa']) && isset($_POST['stinterest']))
					$request = true;
				break;
			case 'rem' :
				if(isset($_POST['stuid']))
					$request = true;
				break;
			case 'get' :
			case 'all' :
				$request = true;
				break;
			default :
				break;
		}
	}
	
	if(!$request){
		$result['success'] = false;
		$result['template'] = '<p class="error">Invalid Request</p>';
		echo json_encode($result);
		exit;
	}
	

	/**
	 * Check for valid user 
	**/
	require_once('../../init.php');	
	if(!$model['valid'] || !isset($model['uid'])){
		$result['success'] = false;
		$result['template'] = '<p class="error">Session Expired. Please Login</p>';
		echo json_encode($result);
		exit;
	}
	$user = $model['uid'];
	
	/**
	 * Check for valid privilege 
	**/
	$admin = false;
	$op = $cl->load("privilege.check", ECROOT);
	$model['privtype'] = 'ENHANCSE_ADMIN';
	$model = $kernel->run($op, $model);
	if($model['valid']){
		$admin = true;
	}
	
	switch($_POST['do']){
		case 'add' :
			if(!$admin){
				$result['success'] = false;
				$result['msg'] = '<p class="error">Not Authorized</p>';
				echo json_encode($result);
				exit;
			}
			
			$op = $cl->load("student.create", ICROOT);
			$model['username'] = $_POST['username'];
			$model['stname'] = $_POST['stname'];
			$model['stemail'] = $_POST['stemail'];
			$model['strollno'] = $_POST['strollno'];
			$model['stcourse'] = $_POST['stcourse'];
			$model['styear'] = $_POST['styear'];
			$model['ststatus'] = $_POST['ststatus'];
			$model['stphone'] = $_POST['stphone'];
			$model['mail'] = false;
			$model['strspath'] = INITROOT.'storage/resume/';
			$model['stphpath'] = INITROOT.'storage/photo/';
			$model = $kernel->run($op, $model);
			
			if($model['valid']){
				$result['success'] = true;
				$result['msg'] = '<p class="success">Student account created succesfully.<br />Password : '.$model['password'].'</p>';
			}
			else {
				$result['success'] = false;
				$result['msg'] = '<p class="error">'.$model['msg'].'</p>';
			}
			break;
			
		case 'edit' :
			if($admin){
				if(!isset($_POST['stname']) || !isset($_POST['stcourse']) || !isset($_POST['styear']) || !isset($_POST['strollno']) || !isset($_POST['ststatus'])){
					$result['success'] = false;
					$result['msg'] = '<p class="error">Invalid Request</p>';
					echo json_encode($result);
					exit;
				}
			}
			
			$op = $cl->load("student.edit", ICROOT);
			$model['stuid'] = $_POST['stuid'];
			$model['stphone'] = $_POST['stphone'];
			$model['stcgpa'] = $_POST['stcgpa'];
			$model['stinterest'] = $_POST['stinterest'];
			$model['admin'] = $admin;
			
			if($admin){
				$model['stname'] = $_POST['stname'];
				$model['strollno'] = $_POST['strollno'];
				$model['stcourse'] = $_POST['stcourse'];
				$model['styear'] = $_POST['styear'];
				$model['ststatus'] = $_POST['ststatus'];
				$model['stinternship'] = $_POST['stinternship'];
				$model['stplacement'] = $_POST['stplacement'];
			}
			$model = $kernel->run($op, $model);
			
			if($model['valid']){
				$result['success'] = true;
				$result['msg'] = '<p class="success">Student profile edited successfully</p>';
			}
			else {
				$result['success'] = false;
				$result['msg'] = '<p class="error">'.$model['msg'].'</p>';
			}
			break;
		
		case 'get' :
			$op = $cl->load("student.info", ICROOT);
			$model['stuid'] = isset($_POST['stuid']) ? $_POST['stuid'] : $user;
			$model = $kernel->run($op, $model);
			
			if($model['valid']){
				$result['success'] = true;
				$result['student'] = $model['student'];
				$result['admin'] = $admin;
			}
			else {
				$result['success'] = false;
				$result['template'] = '<p class="error">'.$model['msg'].'</p>';
			}
			break;
			
		case 'rem' :
			if(!$admin){
				$result['success'] = false;
				$result['msg'] = '<p class="error">Not Authorized</p>';
				echo json_encode($result);
				exit;
			}

			$op = $cl->load("student.delete", ICROOT);
			$model['stuid'] = $_POST['stuid'];
			$model = $kernel->run($op, $model);
			
			if($model['valid']){
				$result['success'] = true;
				$result['template'] = '<p class="success">Student deleted successfully. ID='.$model['stuid'].'</p>';
			}
			else {
				$result['success'] = false;
				$result['template'] = '<p class="error">'.$model['msg'].'</p>';
			}
			break;
			
		case 'all' :
			if(!$admin){
				$result['success'] = false;
				$result['msg'] = '<p class="error">Not Authorized</p>';
				echo json_encode($result);
				exit;
			}
			
			$op = $cl->load("student.all", ICROOT);
			$model['stcourse'] = "1 or 2";
			$model['admin'] = $admin;
			$model = $kernel->run($op, $model);
			
			if($model['valid']){
				$result['success'] = true;
				$result['students'] = $model['students'];
			}
			else {
				$result['success'] = false;
				$result['template'] = '<p class="error">'.$model['msg'].'</p>';
			}
			break;
			
		default :
			break;
	}
	
	echo json_encode($result);

?>