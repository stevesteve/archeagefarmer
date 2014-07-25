<?php

$twigcontext['jscontext'] = json_encode($jscontext);

echo $twig->render($PAGEID.'.twig', $twigcontext);
